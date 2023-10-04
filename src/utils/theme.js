import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: [
            'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 
            'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'
        ].join(','),
        textLabel: {
            color: "#7C7B7B",
            fontWeight: 400,
            fontSize: 14,
        },
        filterText: {
            color: "#394762",
            fontWeight: 400,
            fontSize: 14,
        },
        headingText : {
            fontFamily : "Twilio-Sans-Mono",
            fontSize : 28,
            fontWeight: 500,
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    fontFamily: 'Inter',
                    backgroundColor : "#fff",
                    border: "1px solid #fff",
                    borderRadius : "3px",
                    fontSize: 14,
                    height: 36
                    
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontFamily: 'Inter',
                    backgroundColor : "#fff",
                    border: "1px solid #fff",
                    borderRadius : "3px",
                    fontSize: 14,
                    height: 36
                }
            }
        }
    },
    palette: {
        default: {
            main: "#606B85",
            light: "#fff",
            dark: 'transparent',
            contrastText: "#fff"
        },
        dark: {
            main: "#000",
            light: "#fff",
            dark: 'transparent',
            contrastText: "#fff"
        },
    },
});
export default theme;