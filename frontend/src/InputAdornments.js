import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: -22,
    flexDirection: 'row-reverse',
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 1.5,
  },
  textField: {
    flexBasis: 100,
  },
});

const InputAdornments = (props) => {
  const { classes, unit, value, disabled, onChange } = props;

  return (
    <div className={classes.root}>
      <FormControl
        className={classNames(classes.withoutLabel, classes.textField)}
      >
        <Input
          value={value}
          onChange={onChange}
          disabled={disabled}
          endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
        />
      </FormControl>
    </div>
  );
};

InputAdornments.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  unit: PropTypes.string.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

InputAdornments.defaultProps = {
  value: null,
  disabled: false,
  onChange: () => {},
};

export default withStyles(styles)(InputAdornments);
