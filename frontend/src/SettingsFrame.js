import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FullWidthTabs from './Tab';
import RegistriesMenu from './RegistriesMenu';
import { getAllTcrs } from './api/TcrUtils';

const styles = {
  settings: {
  },
};

class SettingsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTcr: 0,
      tcrs: [],
    };
  }

  componentDidMount() {
    getAllTcrs().then(tcrs => this.setState({ tcrs }));
  }

  handleSelectTcr = () => (index) => {
    this.setState({ selectedTcr: index });
  };

  render() {
    const { className } = this.props;
    const { tcrs, selectedTcr } = this.state;
    return (
      <div>
        <div>
          <Grid container justify="left" spacing={24}>
            <RegistriesMenu
              tcrs={tcrs.map(({ name }) => name)}
              onSelect={this.handleSelectTcr()}
              selected={selectedTcr}
            />
          </Grid>
        </div>
        <div id="settings" className={className}>
          <Grid container justify="center">
            <FullWidthTabs tcr={tcrs[selectedTcr]} />
          </Grid>
        </div>
      </div>
    );
  }
}

SettingsFrame.propTypes = {
  className: PropTypes.string, // eslint-disable-line react/forbid-prop-types
};

SettingsFrame.defaultProps = {
  className: null,
};

export default withStyles(styles)(SettingsFrame);
