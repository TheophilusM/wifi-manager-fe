export const responseData = [
  {
    owner: {
      title: "Mr",
      firstName: "James",
      surname: "Makomo",
      gender: "Male",
      nationalId: "11-32432-Z-23",
      dateOfBirth: "29-07-1980",
      cellPhone: "0776729379/0773294356",
      telephoneWork: "1223",
      telephoneHome: "1223",
      totalPersonsIncludingSpouse: 3,
      nationality: "Zimbabwean",
      individualOrCompany: "Individual", // Individual/Company
      permanentResidence: true,
      everDeclareInsolvent: false,
      addresses: [
        // Residential/Postal/PostalFuture
        {
          type: "Residential Address",
          location: "100423 Kwame Nkrume St, Nyabire, Zimbabwe",
        },
        {
          type: "Postal Address",
          location: "100423 Kwame Nkrume St, Nyabire, Zimbabwe",
        },
      ],
      directors: [
        // Only if it's a Company
        {
          name: "Maxwell",
          surname: "Makamure",
          idNumber: "23-421723-T-32",
          cellphone: "0776324767",
          dateOfBirth: "23-07-1959",
        },
      ],
      employment: [
        {
          employer: "CBZ",
          from: "23-07-2016",
          to: "Present",
        },
        {
          employer: "Econet",
          from: "23-07-2005",
          to: "23-07-2016",
        },
      ],
      insolventDeclarations: [
        {
          details:
            "Had failed to meet our payment deadline that got delayed by 2 months.",
        },
      ],
      policies: [
        {
          policyNumber: 2142153,
          assuranceCompany: "CBZ Insurance",
          sumInsured: "$4,312",
        },
      ],
      civilJudgementOrWritOfExecution: [],
      financialCommitments: [
        {
          commitment: "Banks Loans",
          details: "We have a mortgage loan with ZB Bank",
        },
      ],
      bankers: [
        {
          bank: "CBZ",
          branch: "Sapphire",
          account: "09026212580720",
        },
      ],
      incomeDetails: [],
    },
    coOwners: [
      {
        title: "Mrs",
        firstName: "Mary",
        surname: "Makomo",
        gender: "Female",
        nationalId: "12-24323-E-43",
        dateOfBirth: "29-07-1980",
        cellPhone: "0776729379/0773294356",
        telephoneWork: "1223",
        telephoneHome: "1223",
        totalPersonsIncludingSpouse: 3,
        nationality: "Zimbabwean",
        individualOrCompany: "Individual",
        permanentResidence: true,
        everDeclareInsolvent: false,
        addresses: [
          {
            type: "Residential Address",
            location: "100423 Kwame Nkrume St, Nyabire, Zimbabwe",
          },
        ],
        employment: [],
        policies: [],
        insolventDeclarations: [],
        civilJudgementOrWritOfExecution: [
          {
            details: "Release of shares",
          },
        ],
        financialCommitments: [],
        bankers: [
          {
            bank: "CABS",
            branch: "Borrowdale",
            account: "221424653235",
          },
        ],
      },
    ],
    propertyDetails: {
      propertyAddress: "123 Main Street, Anytown, Zimbabwe",
      propertyType: "Detached House",
      propertyValue: 150000,
      propertySize: 1000, // advice us on the used unit
      purchasePrice: 140000,
      loanAmount: 120000,
      depositAmount: 20000,
      loanTermYears: 25,
      interestRate: 6.5,
      estimatedMonthlyPayment: 790,
      buildingInsurance: "Yes",
      lifeInsurance: "Yes",
      valuationDate: "2024-10-13",
    },
  },
];
