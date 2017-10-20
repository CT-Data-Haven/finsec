import React from 'react';
import * as d3 from 'd3';
import * as _ from 'underscore';
import { ORFrame, XYFrame } from 'semiotic';
import Legend from './Legend';
import '../styles/Chart.css';

let margin = { left: 60, top: 15, bottom: 30, right: 15 };

export default class Chart extends React.Component {
    render() {
        // handle type (bar, time, point)
        let meta = this.props.meta;
		let data = this.props.data;
        console.log(meta);
        console.log(data);
        let color = this.props.color;

        let formStr = meta.format === 'dollar' ? '$.2s' : '.0%';
        let format = d3.format(formStr);
        let direction = meta.projection === 'vertical' ? 'left' : 'bottom';


        let axis = {
            orient: direction,
            tickFormat: d => format(d),
			ticks: meta.ticks || 5
        };

        let max = meta.fill ? '1.0' : d3.max(data, d => d.y);
        let type = meta.bartype !== 'point' ? meta.bartype : { type: 'point', r: 8 };
        let colorExtent = _.chain(data)
            .pluck('color')
            .uniq()
            .value();

        margin.left = meta.left;

        let chart;
        if (meta.chart === 'time') {
            data.forEach((d) => d.group = `${d.color} ${d.style}`);
            let nested = d3.nest()
                .key((d) => d.group)
                .entries(data);

            chart = (<XYFrame
                size={this.props.size}
                lines={nested}
                lineDataAccessor={'values'}
                lineClass={ d => d.data[0].style }
                lineStyle={ d => {
                    return { stroke: color(d.data[0].color), strokeWidth: '2px' };
                } }
                lineIDAccessor={ (d, i) => i }
                xAccessor={ d => +d.x }
                yAccessor={ d => d.y }
                yExtent={[ 0, max ]}
                margin={margin}
                axes={[
                    { orient: 'left', tickFormat: d3.format('.0%'), ticks: 5 },
                    { orient: 'bottom', ticks: 8 }
                ]}
            />);
        } else {
            chart = (<ORFrame
                size={this.props.size}
                data={data}
                type={type}
                oAccessor={'x'}
                rAccessor={'y'}
                rExtent={[ 0, max ]}
                style={ d => { return {
                    fill: color(d.color),
                    // stroke: color(d.color),
                    // strokeWidth: '2px'
                }} }
                projection={meta.projection}
                oPadding={20}
                margin={margin}
                oLabel={true}
                axis={axis}
                // pieceClass={ d => { return meta.bartype } }
            />);
        }

        return (
            <div className="Chart">
                <div className="chart-titles">
                    <h2>{ this.props.text.h1 }</h2>
                    <h4>{ this.props.text.h2 }</h4>
                </div>
                <div className="chart-holder">
                    { chart }
                    <Legend color={color} hasLegend={meta.hasLegend} extent={colorExtent} />
                </div>
            </div>
        );
    }
}
