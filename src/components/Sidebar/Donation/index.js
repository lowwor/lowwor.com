import React from 'react';

import { config } from '../../../../data';

import './index.scss';

const { lightningUrl = '' } = config;

const Donation = () => (
  <div className="friend">
    <p>闪电网络打赏</p>
    <img className="img-donation" src={lightningUrl} alt="Ligtning Donation" />
  </div>
);

export default Donation;
