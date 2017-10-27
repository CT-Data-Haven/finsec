import React from 'react';
import { nest, scaleOrdinal } from 'd3';
import { Grid, Row, Col } from 'react-bootstrap';
import ReactResizeDetector from 'react-resize-detector';

import Pager from './components/Pager';
import Chart from './components/Chart';
import Text from './components/Text';

import './App.css';

const initData = require('./data/finsecv2.json');
const meta = require('./data/meta.json');
const text = require('./data/text.json');

const colorTypes = {
    colorByLoc: {
        domain: [ 'US', 'Connecticut' ],
        range: [ '#70687c', '#ae85e4' ]
    },
    colorBySex: {
        domain: [ 'Men', 'Women' ],
        range: [ '#57a2db', '#d257db' ]
    },
    colorByRace: {
        domain: [ 'White', 'Black', 'Latinx' ],
        range: [ '#4e56c5', '#45ae72', '#89388f' ]
    },
    colorByHome: {
        domain: [ 'Female- headed', 'Male- headed', 'Married couple' ],
        range: [ '#db57a2', '#4e92c5', '#92c64e' ]
    },
    colorByAge: {
        domain: [ 'Under age 45', 'Ages 45-64', 'Ages 65+' ],
        range: [ '#db9057', '#60db57', '#57dbd2' ]
    }
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            step: 0,
            width: 500,
            height: 400,
            // motion: 0
            data: []
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
            .key((d) => d.motion)
			.entries(clean);
        this.meta = meta;
        this.setState({
            data: this.split[0].values[0].values
        });
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
        let step = e - 1;
        let nested = this.split[step].values;
        this.setState({
            data: nested[0].values,
            step: step
        });

        if (nested.length > 1) {
            setTimeout(() => {
                this.setState({
                    data: nested[1].values
                });
            }, 2000);
        }

    }

    render() {
        let step = this.state.step;
        let colorType = colorTypes[this.meta[step].color];
        let color = scaleOrdinal()
            .domain(colorType.domain)
            .range(colorType.range);

        let data = this.state.data;

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
                                data={data}
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
                                <p>Source: DataHaven analysis (2017) of US Census Bureau, American Community Survey 2015 5-year estimates; Bureau of Labor Statistics, Current Population Survey, 2002-2016; and 2015 DataHaven Community Wellbeing Survey. <a href="http://www.ctdatahaven.org/">ctdatahaven.org</a></p>
								<p><a href="https://github.com/CT-Data-Haven/finsec/blob/master/financial_security_download.csv" target="_blank">DOWNLOAD THE DATA</a></p>
                            </footer>
                        </Col>
                    </Row>
                </Grid>


            </div>
        );
    }
}

export default App;
