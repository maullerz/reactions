import React from "react";
import { connect } from "react-redux";
import { updateVar, searchOutputSystem, searchInputSystem } from "../../../actions/moonsheetActions";

// components
import SystemSellBuy from "./../../blocks/SystemSellBuy";

class Panel extends React.Component {
  // Output material systems
  getSuggestionsOutputSystem(term) {
    this.props.searchOutputSystem(term);
  }

  resetSuggestionsOutputSystem() {
    this.props.updateVar("suggestions_output", []);
  }

  setOutputSystem(system_id, system_name) {
    this.props.updateVar("output_system_id", system_id);
    this.props.updateVar("output_system", system_name);
    this.props.updateVar("_need_upd_price_output", true);
  }

  changePriceTypeOutput(typePrice) {
    this.props.updateVar("price_output_type", typePrice);
  }

  // Input material systems
  getSuggestionsInputSystem(term) {
    this.props.searchInputSystem(term);
  }

  resetSuggestionsInputSystem() {
    this.props.updateVar("suggestions_input", []);
  }

  setInputSystem(system_id, system_name) {
    this.props.updateVar("input_system_id", system_id);
    this.props.updateVar("input_system", system_name);
    this.props.updateVar("_need_upd_price_input", true);
  }

  changePriceTypeInput(typePrice) {
    this.props.updateVar("price_input_type", typePrice);
  }

  chLT(type) {
    this.props.updateVar("list_type", type);
  }

  chRefinery(type) {
    this.props.updateVar("refinery_type", type);
  }

  render() {
    let colLeft = "col-md-4";
    let colRight = "col-md-8";
    let { price_input_type, price_output_type, suggestions_output, suggestions_input, list_type, refinery_type } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <table className="inside">
            <thead>
              <tr>
                <th colSpan="2">Panel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2" className="inside-table">
                  <div className="row">
                    <div className={colLeft}>Input materials</div>
                    <div className={colRight}>
                      <SystemSellBuy
                        suggestions={suggestions_input}
                        setSystem={this.setInputSystem.bind(this)}
                        getSuggestions={this.getSuggestionsInputSystem.bind(this)}
                        resetSuggestions={this.resetSuggestionsInputSystem.bind(this)}
                        typePrice={price_input_type}
                        setTypePrice={this.changePriceTypeInput.bind(this)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className={colLeft}>Output materials</div>
                    <div className={colRight}>
                      <SystemSellBuy
                        suggestions={suggestions_output}
                        setSystem={this.setOutputSystem.bind(this)}
                        getSuggestions={this.getSuggestionsOutputSystem.bind(this)}
                        resetSuggestions={this.resetSuggestionsOutputSystem.bind(this)}
                        typePrice={price_output_type}
                        setTypePrice={this.changePriceTypeOutput.bind(this)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className={colLeft}>List type</div>
                    <div className={colRight}>
                      <div className="btn-group">
                        <button onClick={this.chLT.bind(this, "full")} className={list_type === "full" ? "active" : ""}>
                          full
                        </button>
                        <button onClick={this.chLT.bind(this, "short")} className={list_type === "short" ? "active" : ""}>
                          short
                        </button>
                      </div>
                      <div className="btn-group">
                        <button onClick={this.chRefinery.bind(this, "athanor")} className={refinery_type === "athanor" ? "active" : ""}>
                          athanor
                        </button>
                        <button onClick={this.chRefinery.bind(this, "tatara")} className={refinery_type === "tatara" ? "active" : ""}>
                          tatara
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className={colLeft}>Profit</div>
                    <div className={colRight}>
                      Colorized values (red or green)
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(state => state.moonSheetReducer, { updateVar, searchOutputSystem, searchInputSystem })(Panel);
