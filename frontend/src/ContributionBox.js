import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  nameinput: {
    margin: theme.spacing.unit,
    width: '20%',
  },
  urlinput: {
    margin: theme.spacing.unit,
    width: '50%',
  },
  applybutton: {
    margin: theme.spacing.unit,
    width: '10%',
    backgroundColor: '#FFF',
    '&:hover': {
      variant: 'cotained',
      color: '#FFF',
      backgroundColor: '#09F',
    },
  },
});

class CBox extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Input
          placeholder="Name"
          className={classes.nameinput}
          inputProps={{
            'aria-label': 'Description',
          }}
        />
        <Input
          placeholder="URL"
          className={classes.urlinput}
          inputProps={{
            'aria-label': 'Description',
          }}
        />
        <Button variant="outlined" color="primary" className={classes.applybutton}>
          Apply
        </Button>
      </div>
    );
  }
}

CBox.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(CBox);
