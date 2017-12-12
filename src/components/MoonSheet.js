import React, { Component } from 'react'
// import Panel from "./moonsheet/Panel"
import SheetItems from "./moonsheet/SheetItems"
import './MoonSheet.css'


class MoonSheet extends Component {
  render() {
    return (
      <div className="sheet-root">
        <div className="row">
          <div className="col-md-4 t-a_l col-first">
            {/*<Panel />*/}
          </div>
          <div className="col-md-8 t-a_l col-last">
            <SheetItems title="Moon materials" />
          </div>
        </div>
      </div>
    )
  }
}

export default MoonSheet
