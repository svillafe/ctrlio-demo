import React from "react";

export default class Deal extends React.Component {
  render() {

    const { deal }      = this.props;
    deal.tariff_minutes = deal.tariff_minutes == -1? "unlimited" : deal.tariff_minutes;
    deal.tariff_texts   = deal.tariff_texts == -1? "unlimited" : deal.tariff_texts;
    deal.tariff_data    = deal.tariff_data == -1? "unlimited" : deal.tariff_data;


    return (
      <div class="col-md-4 product">
        <h4>{deal.network_provider_name} {deal.product_variant.name}</h4>
        <div class="col-md-3">
        	{deal.tariff_minutes}
        	<p>minutes</p>
        </div>
        <div class="col-md-3">
        	{deal.tariff_texts}
        	<p>texts</p>
        </div>
        <div class="col-md-3">
        	{deal.tariff_data}
        	<p>data</p>
        </div>
        <div class="col-md-3">
        	￡{deal.total_monthly}
        	<p>a month</p>
        </div>
      </div>
    );
  }
}
