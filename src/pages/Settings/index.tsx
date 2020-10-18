import { Box, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import React from 'react';
import { useSelector } from 'react-redux';
import Scaffold from '../../containers/layouts/Scaffold';
import useActions from '../../redux/actions';
import * as TabActions from '../../redux/actions/tabs';
import { RootState } from '../../redux/reducers';
import AccountSettings from '../../views/Settings/AccountsTab/AccountSettings';
import TeammingTab from '../../views/Settings/TeammingTab';
import UserManagement from '../../views/Settings/UserManagementTab/UserManagement';
import useStyles from './styles';

interface TabPanelProps {
  children: React.ReactNode;
  index: any;
  value: any;
}

// TabPanel ise used to implement the functioning of tabs
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box style={{ marginLeft: 15 }}>{children}</Box>}
    </div>
  );
}

// tabProps returns 'id' and 'aria-control' props of Tab
function tabProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Settings: React.FC = () => {
  const classes = useStyles();

  const settingsTabValue = useSelector(
    (state: RootState) => state.tabNumber.settings
  );
  const userData = useSelector((state: RootState) => state.userData);
  const tabs = useActions(TabActions);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    tabs.changeSettingsTabs(newValue);
  };

  const theme = useTheme();

  return (
    <Scaffold>
      <Typography variant="h3" className={classes.Head}>
        Settings
      </Typography>
      <Paper className={classes.root} elevation={0}>
        <Tabs
          data-cy="settingsTabPanel"
          value={settingsTabValue}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
        >
          <Tab data-cy="my-account" label="My Account" {...tabProps(0)} />
          <Tab data-cy="teaming" label="Team" {...tabProps(1)} />
          {userData.username === 'admin' ? (
            <Tab
              data-cy="user-management"
              label="User Management"
              {...tabProps(2)}
            />
          ) : (
            <></>
          )}
        </Tabs>
      </Paper>
      <TabPanel value={settingsTabValue} index={0}>
        <AccountSettings />
      </TabPanel>
      <div data-cy="teamTabPanel">
        <TabPanel value={settingsTabValue} index={1}>
          <TeammingTab />
        </TabPanel>
      </div>
      {userData.username === 'admin' ? (
        <TabPanel value={settingsTabValue} index={2}>
          <UserManagement />
        </TabPanel>
      ) : (
        <></>
      )}
    </Scaffold>
  );
};

export default Settings;
