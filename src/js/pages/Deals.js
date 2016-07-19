import React from "react";
import $ 		from "jquery";
import ASQ  from "asynquence" 
import Deal from "../components/Deal";

var baseURL = process.env.NODE_ENV == "production"? 
                                        "https://ctrlio-demo-api.herokuapp.com" : 
                                        "http://localhost:3000";

export default class Deals extends React.Component {

  constructor() {
    super();
    this.state = {
      networkProviders : {},
      unfilteredData   : [],
      filteredData     : [],
      textFilter       : null,
      texts            : 200,
      mins             : 250,
      data             : 1
    };
  }



  fetchDeals(done) {
    $.ajax({
      url      :  baseURL + "/deals?clickAndCollect=false&contractLength=&data="+ 
                  this.state.data * 1024 +"&dedup=true&includeRefurbished=true&includeResellers=true&limit=10&mins="+ 
                  this.state.mins +"&only4g=false&page=1&sortOrder=asc&sortProperty=averaged_monthly&texts="+ 
                  this.state.texts,

      dataType :  'json',
      cache    :  false,
      success  :  function sucess(response) {
                    for(var i = 0 ; i < response.result.deals.length ; i ++ ){
                      if(this.state.networkProviders[response.result.deals[i].network_id] != undefined){
                        response.result.deals[i].network_provider_name = this.state.networkProviders[response.result.deals[i].network_id].name;  
                      }
                    }
                    this.setState({unfilteredData: response.result.deals});
                    done();
                  }.bind(this),
      error    :  function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                  }.bind(this)
    });
  }

  fetchNetworkProviders(done) {
    $.ajax({
      url      :  baseURL+"/networkProviders",
      dataType :  'json',
      cache    :  false,
      success  :  function sucess(response) {
                    var networkProviders = {};
                    for(var i = 0 ; i < response.result.length ; i++){
                      networkProviders[response.result[i].id] = response.result[i];
                    }
                    this.setState({networkProviders});
                    done();
                  }.bind(this),
      error    :  function error(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                  }.bind(this)
    });
  }

  componentDidMount() {
    ASQ()
      .then(this.fetchNetworkProviders.bind(this))
      .then(this.fetchDeals.bind(this));
  }

  filterHandler(e) {
    const textFilter = e.target.value.toLowerCase();
    
    if(textFilter.length > 0){
      this.setState({textFilter});
      this.setState({filteredData : this.state.unfilteredData.filter(deal =>  (deal.product.name.toLowerCase().indexOf(textFilter) > -1 || 
                                                                              deal.product_variant.name.toLowerCase().indexOf(textFilter) > -1))});
    }else{
      this.setState({textFilter : null});
    }
  }

  searchHandler(e){
    this.setState({texts:this.refs.texts.value});
    this.setState({data:this.refs.data.value});
    this.setState({mins:this.refs.mins.value});
    ASQ().then(this.fetchDeals.bind(this));
  }


  render(){
    var Deals = [];

    if(this.state.textFilter == null){
      Deals = this.state.unfilteredData.map((deal, i) => <Deal key={i} deal={deal}/>);  
    }else{
      Deals = this.state.filteredData.map((deal, i) => <Deal key={i} deal={deal}/>);  
    }
    
    return (
      <div>
        <div class="row">
          <div class="col-lg-12">
            <div class="well text-center">
              <h3>Showing results for</h3>
              <label for="">Texts:</label>
              <input type="text" 
                     placeholder="Amount of texts messages"
                     ref="texts"
                     value={this.state.texts} 
                     onChange={this.searchHandler.bind(this)}/>

              <label for="">Data (GB):</label>
              <input type="text" 
                     placeholder="Amount of data in GB"
                     ref="data"
                     value={this.state.data}
                     onChange={this.searchHandler.bind(this)}/>

              <label for="">Mins:</label>
              <input type="text" 
                     placeholder="Amount of minutes"
                     ref="mins"
                     value={this.state.mins}
                     onChange={this.searchHandler.bind(this)}/>

              <h3>Filter results</h3>
                <div class="input-box">
                  <label for="">Filter by name:</label>
                  <input type="text" 
                         placeholder="Product Name" 
                         onChange={this.filterHandler.bind(this)}/>
                </div>
            </div>
          </div>
        </div>

        <div class="row">{Deals}</div>
      </div>
    );
  }
}
