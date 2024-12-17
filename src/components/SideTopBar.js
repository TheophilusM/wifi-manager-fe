import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { menuIcons, tabs } from "../constants/tabs";
import full_logo from "../assets/full_logo.png";
import mini_logo from "../assets/mini_logo.png";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { decrypt } from "../services/_crypto";
import { roleGroups } from "../constants/roles";

const SideTopBar = ({ children, page }) => {
  const [navClosed, setNavClosed] = useState(false);
  const { logoutUser } = useContext(AuthContext);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.sessionStorage.getItem("user")) {
      setUser(JSON.parse(decrypt(window.sessionStorage.getItem("user"))));
    }
    return () => {};
  }, []);

  return (
    <main>
      <aside className={navClosed ? `navClosed` : ""}>
        <div>
          <div
            className="flex-horizontal-between-center icon-div"
            style={{ height: 50, padding: "0 10px 0 60px" }}
          >
            {navClosed ? (
              <img
                width={20}
                style={{ marginLeft: 10 }}
                src={mini_logo}
                alt="logo"
              />
            ) : (
              <div className="flex-horizontal-between-center">
                <img
                  style={{ marginLeft: -30 }}
                  width={140}
                  src={full_logo}
                  alt="logo"
                />
              </div>
            )}
            {navClosed ? (
              <RiMenuUnfoldFill
                className={navClosed ? `navOpenIcon` : "navNotOpenIcon"}
                onClick={() => {
                  window.sessionStorage.setItem(
                    "navClosed",
                    JSON.stringify({ value: false })
                  );
                  return setNavClosed(false);
                }}
              />
            ) : (
              <RiMenuFoldFill
                className="navCloseIcon"
                onClick={() => {
                  window.sessionStorage.setItem(
                    "navClosed",
                    JSON.stringify({ value: true })
                  );
                  return setNavClosed(true);
                }}
              />
            )}
          </div>
          <p className="side-bar-title menu-p">Menu</p>
          <div className="tabs-div">
            {user && (
              <ul>
                {tabs
                  .filter((tab) => {
                    if (tab.level === roleGroups.HASANY) {
                      return tab;
                    }
                    if (user?.isp.includes(tab.level)) {
                      return tab;
                    }
                    return null;
                  })
                  .map((tab, index) => {
                    const icon = menuIcons.find((obj) => {
                      return obj.iconID === tab.iconID;
                    });
                    return (
                      <Link
                        key={index + tab.name}
                        to={`/${tab.path}`}
                        style={{ textDecoration: "none" }}
                      >
                        <li className={`${page === tab.name ? "active" : ""}`}>
                          <div
                            className="flex-horizontal-center"
                            style={{ height: "100%" }}
                          >
                            <span className="tab-icon-h">{icon?.icon}</span>
                            <span className="tab-name-h">{tab.name}</span>
                          </div>
                          {tab.hasArrow ? (
                            <MdOutlineArrowForwardIos className="tab-f-icon-h" />
                          ) : null}
                          <div className="hover-title">{tab.name}</div>
                        </li>
                      </Link>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
        <div className="user-info">
          <p style={{ width: "200px" }}>
            Status
            <span className="online-badge"></span>
          </p>
        </div>
      </aside>
      <section>
        <nav className={navClosed ? `navClosed` : ""}>
          <div className="flex-horizontal-center">
            <span className="menu">mini</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p style={{ margin: 0 }} className="badge" title={user && user.it}>
              {user && user.it}
            </p>
            <span style={{ cursor: "pointer" }} onClick={() => logoutUser()}>
              Logout
            </span>
          </div>
        </nav>
        <div className={navClosed ? `navClosed children` : "children"}>
          {children}
        </div>
      </section>
    </main>
  );
};

// export default memo(SideTopBar);
export default SideTopBar;
