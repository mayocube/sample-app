// Using this shared state module for any shared objects
// that can't / shouldn't be stored in Redux, such as
// class instances like the voiceSyncHeartbeat, which need
// to be leveraged across multiple components or modules

const sharedState = {
  voiceSyncCommands: null,
  voiceSyncHeartbeat: null,
};

export default sharedState;
