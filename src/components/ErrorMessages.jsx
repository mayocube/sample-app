import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Accordion, Button, Icon, Popup } from 'semantic-ui-react';

const ErrorMessages = () => {
  const messages = useSelector(state => state.error?.messages);
  const [activeTitleIndex, setActiveTitleIndex] = useState(0);
  const [clipboardMessage, setClipboardMessage] = useState();
  const [isClipboardMessageOpen, setIsClipboardMessageOpen] = useState(false);

  const formatErrorMessage = (msg) => {
    return `${msg.timestamp} (${msg.source}) - ${msg.message}`;
  };

  const handleTitleClick = (e, titleProps) => {
    const { index } = titleProps;

    const newIndex = activeTitleIndex === index ? -1 : index;

    setActiveTitleIndex(newIndex);
  };

  const handleCopyToClipboard = () => {
    let clipboardContents = '';
    messages.forEach((msg) => {
      clipboardContents += formatErrorMessage(msg);
      clipboardContents += '\n';
    });

    const clipboardMessageDisplayTimeout = 2000;

    navigator.clipboard.writeText(clipboardContents).then(() => {
      console.debug('ErrorMessages, messages copied to clipboard');
      setClipboardMessage('Successfully copied to clipboard');
      setIsClipboardMessageOpen(true);
      setTimeout(() => {
        setIsClipboardMessageOpen(false);
      }, clipboardMessageDisplayTimeout);
    }).catch((error) => {
      console.error('ErrorMessages, error copying messages to clipboard.', error);
      setClipboardMessage("Couldn't copy to clipboard. Please try again.");
      setIsClipboardMessageOpen(true);
      setTimeout(() => {
        setIsClipboardMessageOpen(false);
      }, clipboardMessageDisplayTimeout);
    });
  };

  const renderErrorMessages = () => {
    if (Array.isArray(messages) && messages.length > 0) {
      return (
        <div className="error-container">
          <div><p>When working with support, please provide them any errors showing below.</p>
            <p />
          </div>
          <Popup
            trigger={(
              <Button
                style={{ minHeight: '36px', margin: 'auto' }}
                onClick={handleCopyToClipboard}
              >
                <Icon name="clipboard" />
                Copy Error Messages to Clipboard
              </Button>
            )}
            content={clipboardMessage}
            mouseLeaveDelay={500}
            on="hover"
            open={isClipboardMessageOpen}
            position="top center"
          />
          <Accordion
            className="error-accordion"
            defaultActiveIndex={0}
            styled
          >
            <Accordion.Title
              active={activeTitleIndex === 0}
              index={0}
              onClick={handleTitleClick}
            >
              <Icon name="dropdown" />
              Click here to show or hide error messages
            </Accordion.Title>
            <Accordion.Content
              active={activeTitleIndex === 0}
              className="error-messages"
            >
              {messages.map(msg => (
                <div>{formatErrorMessage(msg)}</div>
              ))}
            </Accordion.Content>
          </Accordion>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="error-container">
      <div>If you're experiencing issues, please contact WFH support at 972-501-5880.</div>
      <div>Hours of operation are Monday to Sunday 8am to 9pm.</div>
      {renderErrorMessages()}
    </div>
  );
};

export default ErrorMessages;
