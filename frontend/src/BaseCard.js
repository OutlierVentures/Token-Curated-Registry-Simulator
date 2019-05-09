import React from 'react';
import PropTypes from 'prop-types'; import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/lab/Slider';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CustomizedTooltips from './InformationButton';

const styles = {
  card: {
    width: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  slider: {
    padding: '22px 0px',
  },
  agent: {
    fontSize: '16px',
    fontWeight: 500,
  },
};


class BaseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
      ignoreQuality: true,
    };
  }

  getBehaviorComponents() {
    const { classes } = this.props;
    const { type, frequency, ignoreQuality, qualityScale } = this.state;
    if (type === 'maintainer') {
      return (
        <div>
          <FormControlLabel
            label="Ignore submission quality"
            control=<Checkbox
              label="Submission Quality"
              checked={ignoreQuality}
              onChange={this.handleChangeQuality('ignoreQuality')}
              value="ignoreQuality"
            />
          />
          <Typography>Acceptance Likelihood</Typography>
          {' '}
          <CustomizedTooltips classes="" content="acceptanceLikelihood" />
          {frequency}
          <Slider
            className={classes.slider}
            value={frequency}
            onChange={this.handleChangeFreqSlider}
          />
        </div>
      );
    }
    if (type === 'contributor') {
      return (
        <div>
          <Typography>Submission Frequency</Typography>
          <CustomizedTooltips classes="" content="submissionFreq" />
          {' '}
          {frequency}
          <Slider
            className={classes.slider}
            value={frequency}
            onChange={this.handleChangeFreqSlider}
          />
          <Typography>Submission Quality</Typography>
          <CustomizedTooltips classes="" content="submissionQuality" />
          {' '}
          {qualityScale}
          <Slider
            className={classes.slider}
            value={qualityScale}
            onChange={this.handleChangeQualSlider}
          />
        </div>
      );
    }
    return <div />;
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeQuality = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeFreqSlider = (event, value) => {
    this.setState({ frequency: value });
  };

  handleChangeQualSlider = (event, value) => {
    this.setState({ qualityScale: value });
  };

  render() {
    const { classes } = this.props;
    const { type, population } = this.state;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.agent}>
            {type.toUpperCase()}
          </Typography>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="standard_number"
              label="Number"
              value={population}
              onChange={this.handleChange('population')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            {this.getBehaviorComponents()}
          </form>
        </CardContent>
      </Card>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
BaseCard.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  type: PropTypes.string.isRequired,
  population: PropTypes.number.isRequired,
  qualityScale: PropTypes.number,
  acceptanceLikelihood: PropTypes.number.isRequired,
  frequency: PropTypes.number,
};

BaseCard.defaultProps = {
  frequency: 0,
  qualityScale: 0,
};
/* eslint-enable react/no-unused-prop-types */
export default withStyles(styles)(BaseCard);
