import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Input,
  Button, InputGroup, InputGroupAddon
} from 'reactstrap';

import ChatsIcon from './ChatsIcon';
import Identicon from './Identicon';

class Chat extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    data: PropTypes.object,
    publicKey: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      msg: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  onChange(e) {
    this.setState({
      msg: e.target.value
    });
  }

  onKeyPress(e) {
    if (e.key === 'Enter' && this.state.msg) {
      this.onSend();
    }
  }

  onSend() {
    const { data, onSend } = this.props;
    onSend(data.key, this.state.msg);
    this.setState({ msg: '' });
  }

  isSameDay(curTime, prevTime) {
    return curTime.getDay() === prevTime.getDay();
  }

  showMsgHeader(index, curMsg, prevMsg) {
    if (index === 0) {
      return true;
    }

    if (curMsg.sender !== prevMsg.sender) {
      return true;
    }

    return false;
  }

  render() {
    const { data, publicKey } = this.props;
    if (!data || !data.key) {
      return (
        <div className='d-flex justify-content-center h-100'>
          <ChatsIcon fill='#ccc' style={{ width: 92, height: 'auto' }} />
        </div>
      );
    }

    const messages = Object.values(data.messages);

    return (
      <Container fluid className='h-100 d-flex flex-column'>
        <Row
          className='flex-grow-1'
          style={{ overflowX: 'hidden', overflowY: 'scroll' }}>
          {
            messages
              .map((m, i) => {
                const sender = data.participants[m.sender];
                const time = new Date(m.timestamp);
                return (
                  <Fragment key={i}>
                    {
                      i === 0 || !this.isSameDay(time, new Date(messages[i - 1].timestamp)) ?
                        <Col style={{
                          textAlign: 'center',
                          borderBottom: '1px solid #eee',
                          lineHeight: '0.1em',
                          margin: '10px 0 20px',
                        }}>
                          <span style={{
                            background: '#fff',
                            padding: '0 6px',
                            color: '#ddd',
                            fontSize: 14
                          }}>
                            {time.toLocaleDateString()}
                          </span>
                        </Col> :
                        null
                    }
                    <Col sm={12} className='pl-0 pr-0'>
                      {
                        sender === publicKey ?
                          <div className='text-right' style={{ paddingBottom: 2, paddingRight: 6 }}>
                            {
                              this.showMsgHeader(i, m, i > 0 ? messages[i - 1] : null) ?
                                <div style={{ fontSize: 12, color: '#bbb' }} >
                                  {time.toLocaleTimeString()}
                                </div> :
                                null
                            }
                            <div
                              style={{
                                backgroundColor: '#eee',
                                display: 'inline-block',
                                padding: '2px 5px',
                                borderRadius: 4
                              }}>{m.text}</div>
                          </div> :
                          <Fragment>
                            {
                              this.showMsgHeader(i, m, i > 0 ? messages[i - 1] : null) ?
                                <div className="d-flex flex-row pt-3">
                                  <div className="pr-2 pl-2">
                                    <Identicon publicKey={sender} size={32} />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 12, color: '#bbb' }} >
                                      {sender.substr(0, 8)}..., {time.toLocaleTimeString()}
                                    </div>
                                    <div style={{
                                      backgroundColor: '#eee',
                                      display: 'inline-block',
                                      padding: '2px 5px',
                                      borderRadius: 4
                                    }}>{m.text}</div>
                                  </div>
                                </div> :
                                <div className="d-flex flex-row" style={{ paddingTop: 2 }}>
                                  <div style={{ width: 48 }}></div>
                                  <div>
                                    <div style={{
                                      backgroundColor: '#eee',
                                      display: 'inline-block',
                                      padding: '2px 5px',
                                      borderRadius: 4
                                    }}>{m.text}</div>
                                  </div>
                                </div>
                            }
                          </Fragment>
                      }
                    </Col>
                  </Fragment>
                )
              })
          }
        </Row>
        <Row className='flex-shrink-0 pt-3 pb-3'>
          <InputGroup>
            <Input
              value={this.state.msg}
              onChange={this.onChange}
              onKeyPress={this.onKeyPress}
              autoFocus />
            <InputGroupAddon addonType="append">
              <Button
                color="secondary"
                onClick={this.onSend}
                disabled={!this.state.msg}>Send</Button>
            </InputGroupAddon>
          </InputGroup>
        </Row>
      </Container>
    );
  }
}

export default Chat;