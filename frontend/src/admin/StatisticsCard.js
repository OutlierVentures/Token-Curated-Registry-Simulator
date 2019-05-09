import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function StatisticsCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Statistics</Typography>
        <Typography color="textSecondary">
          This card shows the statistics of this registry
        </Typography>
      </CardContent>
    </Card>
  );
}

StatisticsCard.propTypes = {
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

export default StatisticsCard;
