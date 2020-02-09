const { Component } = React;
const { render } = ReactDOM;
const { Switch, Link, Route, HashRouter, Redirect } = ReactRouterDOM;
const API = "https://acme-users-api-rev.herokuapp.com/api/companies";

const Nav = (props) => {
	// console.log(props);
	const { path, companies } = props;
	let currentPath = path.location.pathname;
	return (
		<nav>
			<Link
				to='/profits'
				className={currentPath === "/profits" ? "selected" : null}>
				Acme Companies with React Router
			</Link>
			<Link
				to='/companies'
				className={currentPath === "/companies" ? "selected" : null}>
				Companies ({companies.length})
			</Link>
		</nav>
	);
};

const Profits = () => {
	return <h1> Welcome!!</h1>;
};

const Companies = (props) => {
	const { companies } = props;
	// console.log(companies);
	return (
		<ul>
			{companies.map((company) => (
				<li key={company.id}>
					<Link to={`/companies/${company.id}`}>{company.name}</Link>
				</li>
			))}
		</ul>
	);
};

class Company extends Component {
	constructor() {
		super();
		this.state = {
			profits: [],
			loading: true
		};
	}
	componentDidUpdate(prevProps) {
		// console.log(prevProps);
		let pastId = prevProps.path.match.params.id;
		let currentId = this.props.path.match.params.id;

		if (pastId !== currentId) {
			axios.get(`${API}/${currentId}/companyProfits`).then((response) => {
				// console.log("data from company ID");
				// console.log(response.data);
				this.setState({
					profits: response.data,
					loading: false
				});
			});
		}

		console.log("past Id", pastId);
		console.log("current Id", currentId);
	}

	componentDidMount() {
		let currentId = this.props.path.match.params.id;
		axios.get(`${API}/${currentId}/companyProfits`).then((response) => {
			// console.log("data from company ID");
			// console.log(response.data);
			this.setState({
				profits: response.data,
				loading: false
			});
		});
	}

	render() {
		const { profits, loading } = this.state;
		if (loading) return <div> Company ID loading</div>;
		// console.log(profits);
		return (
			<ul>
				{profits.map((profit) => (
					<li key={profit.id}>
						<p>{profit.fiscalYear}</p>
						<p>{profit.amount}</p>
					</li>
				))}
			</ul>
		);
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			companies: [],
			loading: true
		};
	}

	componentDidMount() {
		axios.get(API).then((response) => {
			this.setState({
				companies: response.data,
				loading: false
			});
		});
	}
	render() {
		const { companies, loading } = this.state;
		if (loading) return <h1>data loading</h1>;

		// console.log(companies);
		return (
			<HashRouter>
				<Route render={(props) => <Nav path={props} companies={companies} />} />
				<main>
					<Route path='/profits' component={Profits} />

					<Route
						path='/companies'
						render={(props) => <Companies companies={companies} />}
					/>

					<Route
						path='/companies/:id'
						render={(props) => <Company path={props} />}
					/>
				</main>
			</HashRouter>
		);
	}
}
const root = document.querySelector("#root");
render(<App />, root);
