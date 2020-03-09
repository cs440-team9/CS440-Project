import React, { Component } from 'react';
import { DatePicker, Form, Input, Modal, Row, Col } from 'antd';

const dateFormat = 'YYYY/MM/DD';

const AddBookForm = Form.create({ name: 'add-book-form' })(    // Don't forget to change the names here
    class extends Component {
        constructor(props) {
            super(props);

            var data = {
                ISBN: null,
                date_published: null,
                title: '',
				genre: '',
                authorID: null,
                publisherID: null,
            };

            this.state = { formData: data };
        }

		// Called after constructor(), before render()
        componentDidMount = async () => {
            // Populate author/publisher dropdown menus by fetching author/publisher tables
            this.getTable("author");
            this.getTable("publisher");
        }

        componentDidUpdate(prevProps) {
            if (
                (prevProps.formData !== this.props.formData) ||
                (prevProps.selectedRowKeys !== this.props.selectedRowKeys) ||
                (prevProps.editing !== this.props.editing)
            ) {
                const { selectedRowKeys, editing } = this.props;
                var data = {};
                if (selectedRowKeys.length !== 1) {
                    data = {
                        ISBN: null,
                        date_published: null,
                        title: '',
                        genre: '',
                        authorID: null,
                        publisherID: null,
                    };
                } else if (selectedRowKeys.length === 1 && editing === true) {
                    data = this.props.defaultData.find(item => item.ISBN === selectedRowKeys[0]);
                }

                this.setState({
                    formData: data,
                    selectedRowKeys: selectedRowKeys
                });

				// Refresh the author/publisher dropdowns.
                this.getTable("author");
                this.getTable("publisher");
            }
        }

        getTable = (tableName) => {
            // Fetch the degree table to get values for select component
            fetch(serverURL + "get_table/ex_" + tableName, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }).then((res) => {
                res.json().then((data) => {
                    // Create the select component
                    var dropdown = [];

                    for (let i = 0; i < data.length; i++)
                        dropdown.push(<Option key={data[i][tableName + "ID"]}>{data[i].name}</Option>);

                    this.setState({ [tableName + "Dropdown"]: dropdown });
                });
            }).catch(err => err);
        }

        render() {
            const { formData } = this.state;
            const { visible, editing, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;

            var okayText = "Add";
            if (editing)
                okayText = "Edit";

            return (
                <Modal
                    visible={visible}
                    title={okayText + " Author"}
                    okText={okayText}
                    onCancel={onCancel}
                    onOk={onCreate}
                    width={450}
                >
                    <Form layout="vertical">
                        <Form.Item label="Book Title" style={{ marginBottom: "0px" }}>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Book title is required' }],
                                initialValue: formData.title || null,
                            })(<Input placeholder="Enter book title..." />)}
                        </Form.Item>
                        <Form.Item label="ISBN" style={{ marginBottom: "0px" }}>
                            {getFieldDecorator('ISBN', {
                                rules: [{ required: true, message: 'ISBN is required' }],
                                initialValue: formData.ISBN || null,
                            })(<Input placeholder="Enter 13 digit ISBN13 code..." />)}
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={10}>
                                <Form.Item label="Date Published" style={{ marginBottom: "0px" }}>
                                    {getFieldDecorator('date_published', {
                                        initialValue: formData.date_published || null,
                                    })(<DatePicker format={dateFormat} />)}
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item label="Genre" style={{ marginBottom: "0px" }}>
                                    {getFieldDecorator('genre', {
                                        initialValue: formData.genre || null,
                                    })(<Input placeholder="Enter book genre..." />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Author" style={{ marginBottom: "0px" }}>
                                    {getFieldDecorator('authorID', {
                                        initialValue: formData.authorID || null,
                                    })(
                                        <Select placeholder="Select author" dropdownMatchSelectWidth={false} style={{ width: 190 }}>
                                            {this.state.authorDropdown}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Publisher" style={{ marginBottom: "0px" }}>
                                    {getFieldDecorator('genre', {
                                        initialValue: formData.genre || null,
                                    })(
                                        <Select placeholder="Select publisher" dropdownMatchSelectWidth={false} style={{ width: 190 }}>
                                            {this.state.publisherDropdown}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            )
        }
    }
)

export { AddBookForm };