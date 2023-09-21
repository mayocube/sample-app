import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        textLabel: {
            color: "#7C7B7B",
            fontSize: 14,
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor : "#fff",
                    border: "1px solid #fff",
                    borderRadius : "3px"
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor : "#fff",
                    border: "1px solid #fff",
                    borderRadius : "3px"
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