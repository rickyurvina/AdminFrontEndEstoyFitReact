import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from '../../constants/AppEnums';

const useStyles = makeStyles((theme) => ({
  '@global': {
    // for global styles
    '.MuiLink-root': {
      fontFamily: Fonts.REGULAR,
    },
  },
}));

export default useStyles;
