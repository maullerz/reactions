import React from "react";
import { connect } from "react-redux";
import { updateVar } from "../../../actions/moonsheetActions";

class FilterPanel extends React.Component {
  makeFilter(e) {
    this.props.updateVar("filter", e.target.value);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel-content">
            <h1>Moon Sheet</h1>
            <input
              placeholder="Filter materials"
              onChange={this.makeFilter.bind(this)}
              className="input-search"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state.moonSheetReducer, { updateVar })(
  FilterPanel
);
