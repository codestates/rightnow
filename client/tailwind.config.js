module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./config/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
        'tag': {'max': '567px'},
    },
    fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
    },
    extend: {
        spacing: {
            "8xl": "96rem",
            "9xl": "128rem",
            0.25: "1px",
            0.75: "3px",
            4.5: "18px",
            8.5: "34px",
            13: "52px",
            14.5: "58px",
            15: "60px",
            18: "72px",
            19: "76px",
            222: "888px",
            17.5: "70px",
            21.5: "86px",
            30: "120px",
            50: "200px",
            54: "216px",
            60: "240px",
            112: "448px",
            120: "480px",
            135: "540px",
            160: "640px",
            167.5: "670px",
            192: "768px",
            215: "860px",
            250: "1000px",
            278: "1112px",
            "102%": "102%",
            "100vh": "100vh",
        },
        borderWidth: {
            1: "1px",
        },
        borderRadius: {
            "4xl": "2rem",
        },
        colors: {
            main: "tomato",
            lightMain: "#ffe9e5",
            subMain: "#fc1657",
            sub: "#1C1C1B",
            kakao: '#FBE300',
            kakaoText: '#3B1E1E',

        },
        minWidth: {
            5: "20px"
        },
        minHeight: {
            12: "48px",
            login: "calc(100vh - 72px)",
            forms: "calc(100vh - 10px)",
            myforms: "calc(100vh - 110px)",
        },
        height: {
            11.5: "46px",
        },
        width: {
            11.5: "46px",
        },
    },
},
  plugins: [],
}
