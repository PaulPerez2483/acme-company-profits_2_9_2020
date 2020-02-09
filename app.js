const { Component } = React
const { render } = ReactDOM
const { Switch, Link, Route, HashRouter, Redirect } = ReactRouterDOM

class App extends Component {
	render() {
		return "Your app here"
	}
}
const root = document.querySelector("#root")
render(<App />, root)
