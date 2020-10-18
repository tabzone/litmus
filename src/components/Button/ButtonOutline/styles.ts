import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonOutline: {
    minWidth: '6.875rem',
    height: '2.8125rem',
    border: '0.0625rem solid',
    borderColor: theme.palette.secondary.dark,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    textTransform: 'none',
  },
  valueField: {
    fontSize: '0.75rem',
  },
}));

export default useStyles;
