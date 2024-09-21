import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SETTING CARD WRAPPER ||============================== //

const SettingCardWrapper = ({ children, ...other }) => (
  <MainCard
    sx={{
      maxWidth: { xs: 900, lg: 1400 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%'
      }
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
  </MainCard>
);

SettingCardWrapper.propTypes = {
  children: PropTypes.node
};

export default SettingCardWrapper;
