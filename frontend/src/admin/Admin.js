import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Switch from '@material-ui/core/Switch';
import AdminTCRPage from './AdminTCRPage';
import TcrDialog from './TcrDialog';
import { getAllTcrs } from '../api/TcrUtils';

const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
  button: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
});

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tcrDialogOpened: false,
      selectedTcr: 0,
      tcrs: [],
    };
  }

  componentDidMount() {
    getAllTcrs()
      .then(tcrs => this.setState({ tcrs }))
      .catch(console.error); // eslint-disable-line no-console
  }

  onTCRSelected(selectedIndex) {
    this.setState({ selectedTcr: selectedIndex });
  }

  handleSwitch = () => {
    this.props.history.push('/player'); // eslint-disable-line 
  }

  handleTcrDialogCreate = () => (newTcr) => {
    const { tcrs } = this.state;
    const newLength = tcrs.push(newTcr);
    this.setState({ tcrs, tcrDialogOpened: false });
    this.onTCRSelected(newLength - 1);
  }

  handleTcrDialogCancel() {
    this.setState({ tcrDialogOpened: false });
  }

  showTcrDialog() {
    this.setState({ tcrDialogOpened: true });
  }

  render() {
    const { classes } = this.props;
    const { tcrDialogOpened, selectedTcr, tcrs } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              TCR Simulator
            </Typography>
            <Switch onChange={this.handleSwitch} />
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List subheader={<ListSubheader component="div">Deployed TCRs</ListSubheader>}>
            {tcrs.map((tcr, index) => (
              <ListItem
                button
                key={tcr.name}
                onClick={() => this.onTCRSelected(index)}
                selected={selectedTcr === index}
              >
                <ListItemIcon><ListAltIcon /></ListItemIcon>
                <ListItemText primary={tcr.name} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.showTcrDialog()}
          >
            Create new TCR
          </Button>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {
            tcrs[selectedTcr]
              ? <AdminTCRPage tcr={tcrs[selectedTcr]} />
              : <div />
          }
        </main>
        <TcrDialog
          open={tcrDialogOpened}
          handleCancel={() => this.handleTcrDialogCancel()}
          handleCreate={this.handleTcrDialogCreate()}
        />
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(Admin);
