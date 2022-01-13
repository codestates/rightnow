module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./config/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
    },
    extend: {
        spacing: {
            "8xl": "96rem",
            "9xl": "128rem",
            0.75: "3px",
            4.5: "18px",
            8.5: "34px",
            14.5: "58px",
            15: "60px",
            18: "72px",
            19: "76px",
            222: "888px",
            17.5: "70px",
            21.5: "86px",
            30: "120px",
            50: "200px",
            60: "240px",
            112: "448px",
            120: "480px",
            135: "540px",
            167.5: "670px",
            192: "768px",
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
            subMain: "#fc1657",
            sub: "#1C1C1B",
            kakao: '#FBE300',
            kakaoText: '#3B1E1E',

        },
        minWidth: {
            5: "20px"
        },
        minHeight: {
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
