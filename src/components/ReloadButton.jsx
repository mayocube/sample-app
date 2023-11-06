import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';

const ReloadButton = () => {
  const handleClick = () => {
    window.location.reload();
  }

  return (
    <div>
      <div><p>After resolving any errors showing below, please click this button to try reloading the voice client.</p>
        <p></p>
      </div>
      <Button
        primary
        onClick={handleClick}
      >Reload Voice Client
      </Button>
    </div>
  )
}

export default ReloadButton