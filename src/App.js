import React from 'react';
import { nest, scaleOrdinal } from 'd3';
import { Grid, Row, Col } from 'react-bootstrap';
import ReactResizeDetector from 'react-resize-detector';

import Pager from './components/Pager';
import Chart from './components/Chart';
import Text from './components/Text';

import './App.css';

const initData = require('./data/finsec.json');
const meta = require('./data/meta.json');
const text = require('./data/text.json');

// const color = scaleOrdinal()
//     .domain([ 'Connecticut', 'US', 'Men', 'Women', 'Black', 'Latinx', 'White', 'Female-headed household', 'Male-headed household', 'Married couple' ])
//     .range([ '#ae85e4', '#70687c', '#57a2db', '#d257db', '#4e56c5', '#45ae72', '#89388f', '#db57a2', '#4e92c5', '#92c64e' ]);

const colorTypes = {
    colorByLoc: {
        domain: [ 'Connecticut', 'US' ],
        range: [ '#ae85e4', '#70687c' ]
    },
    colorBySex: {
        domain: [ 'Men', 'Women' ],
        range: [ '#57a2db', '#d257db' ]
    },
    colorByRace: {
        domain: [ 'Black', 'Latinx', 'White' ],
        range: [ '#4e56c5', '#45ae72', '#89388f' ]
    },
    colorByHome: {
        domain: [ 'Female- headed', 'Male- headed', 'Married couple' ],
        range: [ '#db57a2', '#4e92c5', '#92c64e' ]
    }
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            step: 0,
            width: 500,
            height: 400
        };
        this.onPageChange = this.onPageChange.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentWillMount() {
        // setup data
        let clean = initData;
        clean.forEach((d) => d.y = +d.y);
        this.split = nest()
			.key((d) => d.step)
			.entries(clean);
        this.meta = meta;
    }

    onResize = (w, h) => {
        let width = Math.round(0.9 * w);
        let height = Math.round(width * 2/3);

        this.setState({
            width: width,
            height: height
        });
    };

    onPageChange(e) {
        this.setState({step: e - 1});
    }

    render() {
        let step = this.state.step;
        let colorType = colorTypes[this.meta[step].color];
        let color = scaleOrdinal()
            .domain(colorType.domain)
            .range(colorType.range);

        return (
            <div className="App">
                <Grid>
                    <h1 className="title">Financial (in)security in Connecticut</h1>
                    <Row>
						<Col sm={6} md={4}>
                            <Text text={text[step]} />

							<Pager onPageChange={this.onPageChange} items={this.split.length} activePage={this.state.step + 1}/>
						</Col>
						<Col sm={6} md={8}>
                            <Chart
                                data={this.split[step].values}
                                meta={this.meta[step]}
                                size={[ this.state.width, this.state.height ]}
                                color={color}
                                text={text[step]}
                            />
                            <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                        </Col>
					</Row>
                    <Row>
                        <Col sm={12}>
                            <footer>
                                <p>Source: DataHaven analysis (2017) of US Census Bureau American Community Survey 2015 5-year estimates, Local Area Unemployment Statistics, and 2015 DataHaven Community Wellbeing Survey. <a href="http://www.ctdatahaven.org/">ctdatahaven.org</a></p>
                            </footer>
                        </Col>
                    </Row>
                </Grid>


            </div>
        );
    }
}

export default App;
