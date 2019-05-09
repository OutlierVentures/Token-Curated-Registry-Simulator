import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Registry from '../Tab';

function RegistryCard(props) {
  const { tcr } = props;
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Registry</Typography>
        <Registry tcr={tcr} />
      </CardContent>
    </Card>
  );
}

RegistryCard.propTypes = {
  tcr: PropTypes.shape({
    name: PropTypes.string.isRequired,
    parameters: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default RegistryCard;
