import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

function ParametersCard(props) {
  const { tcr } = props;
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Parameters</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tcr.parameters.map(param => (
              <TableRow key={param.key}>
                <TableCell component="th" scope="row">{param.key}</TableCell>
                <TableCell>{param.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

ParametersCard.propTypes = {
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

export default ParametersCard;
