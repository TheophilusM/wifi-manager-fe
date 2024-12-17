module.exports = {
  presets: [
    "@babel/preset-env",   // For compiling modern JavaScript down to ES5
    "@babel/preset-react"  // For compiling JSX and React syntax
  ],
  plugins: [
    "@babel/plugin-proposal-private-property-in-object" // For handling private properties in objects
  ]
};