import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 120,
    backgroundColor: theme.palette.background.paper,
  },
});

class RegistriesMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClickListItem = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (index) => {
    const { onSelect } = this.props;
    this.setState({ anchorEl: null });
    onSelect(index);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, tcrs, selected } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="Registries"
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary="Registries"
              secondary={tcrs[selected]}
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          getContentAnchorEl={null}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {tcrs.map((tcr, index) => (
            <MenuItem
              key={tcr}
              selected={index === selected}
              onClick={() => this.handleMenuItemClick(index)}
            >
              {tcr}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

RegistriesMenu.propTypes = {
  classes: PropTypes.object.isRequired, //eslint-disable-line
  tcrs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
};

RegistriesMenu.defaultProps = {
  onSelect: () => {},
};

export default withStyles(styles)(RegistriesMenu);
