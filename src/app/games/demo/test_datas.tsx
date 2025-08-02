interface UnityFunction {
  type: 'getState' | 'sendEtatJsonToReact' | 'getId' | 'sendEtat';
  name: string;
  returnType: string;
}

interface UnityJsonObject {
  id: string;
  name: string;
  type: string;
  gameObject: string;
  functions: UnityFunction[];
}

export const unityJsonObjects = [
  {
    id: 'a15465158',
    name: 'Sensor_1',
    type: 'sensor',
    gameObject: 'Sensor_1',
    functions: [
      { type: 'getState', name: 'GetEtat', returnType: 'int' },
      { type: 'getId', name: 'GetId', returnType: 'string' },
      {
        type: 'sendStateReact',
        name: 'SendEtatJsonToReact',
        returnType: 'string',
      },
    ],
  },
  {
    id: 'a1rr58',
    name: 'Sensor_1',
    type: 'sensor',
    gameObject: 'Pipe',
    functions: [
      { type: 'getState', name: 'GetEtat', returnType: 'int' },
      { type: 'getId', name: 'GetId', returnType: 'string' },
      {
        type: 'sendStateReact',
        name: 'SendEtatJsonToReact',
        returnType: 'string',
      },
    ],
  },
];
