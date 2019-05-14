import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import sum from 'hash-sum';

import ContactInvite from './ContactInvite';
import ContactListGroup from './ContactListGroup';
import ContactRequest from './ContactRequest';
import Identicon from './../../../base/components/Identicon';
import { groupBy } from './../../../base/fn';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  contact: {
    display: 'flex',
    color: 'inherit'
  },
  contactTitle: {
    paddingLeft: theme.spacing.unit,
    lineHeight: '32px'
  }
});

class ContactList extends Component {
  render() {
    const { contacts, classes } = this.props;
    const map = groupBy(Object.values(contacts), 'type');

    return (
      <>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            All
          </Typography>
          <ContactInvite />
        </Toolbar>
        <ContactListGroup list={map['sent_request']} title='Sent' />
        <ContactListGroup
          list={map['received_request']}
          title='Received'
          renderItem={(c, i) => <ContactRequest key={i} publicKey={c.key} address={c.address} />} />
        <ContactListGroup
          list={map['added']}
          renderItem={(c, i) =>
            <Link key={i}
              to={`/messenger/contact/${sum(c.key)}`}
              className={classes.contact}
              style={{ textDecoration: 'none' }}>
              <div>
                <Identicon publicKey={c.key} size={32} />
              </div>
              <Typography key={i} color="inherit" className={classes.contactTitle} noWrap>
                {c.username || c.key}
              </Typography>
            </Link>
          }>
        </ContactListGroup>
      </>
    );
  }
}

ContactList.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  contacts: PropTypes.object,
};

export default compose(
  connect((state) => {
    const { contacts } = state || {};
    return { contacts };
  }),
  withStyles(styles)
)(ContactList);