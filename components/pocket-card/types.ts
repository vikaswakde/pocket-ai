import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelIcon = React.NamedExoticComponent<any> | any;

export type Model = {
  id: string;
  name: string;
  description: string;
  Icon: ModelIcon;
  apiId: string;
  children?: Model[];
};
