/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // important for React components
  ],
  theme: {
    fontFamily:{
      display:["Poppins","sans-serif"],
    },
    extend: {
      //Colors used ub the project
     colors:{
      primary:"#05B6D3",
      secondary:"#EF863E",
     },
     backgroundImage:{
      'login-bg-img':"url('./src/assets/images/bg-image.jpg')",
      'signup-bg-img':"url('./src/assets/images/sign-up-img.jpg')",
    
      
     }
    },
  },
  plugins: [],
}

