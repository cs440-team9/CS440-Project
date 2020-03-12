import React, { Component, Fragment } from 'react';
import DatabaseTable from './DatabaseTable';
import { serverURL } from '../App';

function toTitleCase(str) {
    if (typeof str === "undefined" || str === null) {
        return "";
    }
    else {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
}

export default class DatabaseTableHandler extends Component {
    state = {
        tableData: null,
        tableLoading: true
    };

    constructor(props) {
        super(props);

        /* Choose which columns to give to the table. */
        const { pageType } = this.props;

		/* Set information about table, including what columns to use, the table's
		 * width, and what key to use at the row's unique identifier. */
        if (pageType === 'Book') {
            this.columns = "BookTableColumns";
            this.tableWidth = 1500;
            this.rowKey = "ISBN";
        }
        else if (pageType === 'Author') {
            this.columns = "AuthorTableColumns";
            this.tableWidth = 875;
            this.rowKey = "authorID";
        }
        else if (pageType === 'Publisher') {
            this.columns = "PublisherTableColumns";
            this.tableWidth = 625;
            this.rowKey = "publisherID";
        }
    }

    /* This is where the fetch for the table data will take place. */
    componentDidMount = async () => {
        await this.tableFetch();
    };

	replaceIDs = async (type) => {
		// Replace all instances of ID with the associated name
		await fetch(serverURL + "get_table/ex_" + type, {
			method: "GET",
			headers: {
				"Accept": "application/json"
			}
		}).then(async (res) => {
			res.json().then(async (data) => {
				// Copy this.state.tableData into a new array.
				var tableDataCopy = [...this.state.tableData];
				var newData = "";

				// Run through all datapoints in the table, replacing ID with associated name
				for (let i = 0; i < tableDataCopy.length; i++) {
					console.log(tableDataCopy[i][type + 'ID']);
					if (tableDataCopy[i][type + 'ID'] !== null) {
						//var ID = parseInt(tableDataCopy[i][type + 'ID']);
						var ID = tableDataCopy[i][type + 'ID'];

						newData = ID + " - " + data.find(item => item[type + 'ID'] == ID).name;

						tableDataCopy[i][type + 'ID'] = newData;
					}
				}

				this.setState({ tableData: tableDataCopy });
			});
		}).catch(err => err);
	}

	// Fetch the appropriate table. If fetching 'ex_book', replace author/publisherIDs with associated names.
    tableFetch = async () => {
        var pageType = this.props.pageType;

        // Replace spaces with underscores and make it all lower case
        pageType = pageType.replace(/ /g, "_").toLowerCase();

        // Only fetches the current table instead of all of them
        await fetch(serverURL + "get_table/ex_" + pageType, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then(async (res) => {
            res.json().then(async (data) => {
                await this.setState({
                    tableData: data,
                    tableLoading: false
                })
            });
        }).catch(err => err);


        // Change the columns that display IDs of foreign keys to display the string instead of the number.
		if (pageType === 'book') {
			await this.replaceIDs('author');
			await this.replaceIDs('publisher');
        }
    }

	/* Callback function so form can pass it's data to this component.
	 * When we actually have the backend completed, this function will make the correct
	 * API call based on which table/form is being rendered. As for right now, with no
	 * backend implemented, this function will be a lot more crowded.
	 */
    formCallback = async (formData, keyNum) => {
        var pageType = this.props.pageType;

        // Replace spaces with underscores and make it all lower case
        pageType = pageType.replace(/ /g, "_").toLowerCase();

        var callBody = {};

        // Show the table as loading while the API call is happening
        this.setState({ tableLoading: true });

        if (pageType === 'book') {
			if (keyNum !== -1)
				callBody.ISBN = keyNum;
			else
				callBody.ISBN = parseInt(formData.ISBN);

            callBody.year_published = formData.year_published;
            callBody.title = toTitleCase(formData.title);
            callBody.authorID = parseInt(formData.authorID);
			callBody.publisherID = parseInt(formData.publisherID);
        } else if (pageType === 'author') {
            if (keyNum !== -1)
                callBody.authorID = keyNum;

            callBody.name = toTitleCase(formData.name);
            callBody.dob = formData.dob;
            callBody.dod = formData.dod;
        } else if (pageType === 'publisher') {
            if (keyNum !== -1)
                callBody.publisherID = keyNum;

            callBody.name = toTitleCase(formData.name);
        }

        // If keyNum === -1, then it's an ADD call. Otherwise, it's PUT call.
        if (keyNum === -1) {
            // Add the new item to the correct table
            await fetch(serverURL + "add_to_" + pageType, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(callBody),
                headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
                }
            }).then((res) => {
                res.json().then((data) => {
                    console.log(data);
                });
            }).catch(err => err);
        } else {
            // Update the new item in the correct table
            await fetch(serverURL + "update_" + pageType, {
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify(callBody),
                headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
                }
            }).then((res) => {
                res.json().then((data) => {
                    console.log(data);
                });
            }).catch(err => err);
        }

        // Wait a second before fetching again
        setTimeout(() => {
            this.tableFetch();
        }, 1000);
    }

    tableDeleteCallback = async (key) => {
        var pageType = this.props.pageType;

        // Replace spaces with underscores and make it all lower case
        pageType = pageType.replace(/ /g, "_").toLowerCase();

        // Show the table as loading while the API call is happening
        this.setState({ tableLoading: true });

        for (let i = key.length - 1; i >= 0; i--) {
            var callBody = {};

            if (pageType === 'book')
                callBody.ISBN = key[i];
            else if (pageType === 'author')
                callBody.authorID = key[i];
            else if (pageType === 'publisher')
                callBody.publisherID = key[i];

            // Delete the item from the correct table
            await fetch(serverURL + "delete_" + pageType, {
                method: "DELETE",
                mode: 'cors',
                body: JSON.stringify(callBody),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                res.json().then((data) => {
                    console.log(data);
                });
            }).catch(err => err);
        }

        // Wait one second per deletion
        setTimeout(() => {
            this.tableFetch();
        }, 1000);
    }

    render() {
        var { tableData, tableLoading } = this.state;
        const { pageType } = this.props;

        return (
            <Fragment>
                <h1>{pageType} Table</h1>

                <br /><br /><br />

                <DatabaseTable
                    tableLoading={tableLoading}
                    rowKey={this.rowKey}
                    columns={this.columns}
                    dataSource={tableData}
                    tableWidth={this.tableWidth}
                    formHandlerType={pageType}
                    formHandlerCallback={this.formCallback}
                    formEditCallback={this.formEditCallback}
                    deleteCallback={this.tableDeleteCallback}
                />
            </Fragment>
        );
    }
}