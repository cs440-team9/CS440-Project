import React, { Component } from 'react';
import { DatePicker, Form, Input, Modal, Row, Col, Select } from 'antd';
import { serverURL } from '../App';
import moment from 'moment';
import SuperSelect from "../SuperSelect";

const { Option } = Select;

const dateFormat = 'YYYY';

const AddBookForm = Form.create({ name: 'add-book-form' })(    // Don't forget to change the names here
    class extends Component {
        constructor(props) {
            super(props);

			this.authorDropdown = null;
			this.publisherDropdown = null;

            var data = {
                ISBN: null,
                year_published: null,
                title: '',
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
                        year_published: null,
                        title: '',
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
            // Fetch the table to get values for select component
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

					this[tableName + "Dropdown"] = dropdown;
                });
            }).catch(err => err);
		}

		handleSelectChange = (value, type) => {
			const { setFieldsValue } = this.props.form;

			if (type === "author")
				setFieldsValue({ authorID: value });
			else
				setFieldsValue({ publisherID: value });
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
                    title={okayText + " Book"}
                    okText={okayText}
                    onCancel={onCancel}
                    onOk={onCreate}
                    width={440}
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
                            <Col span={12}>
                                <Form.Item label="Author" style={{ marginBottom: "0px" }}>
									{getFieldDecorator('authorID', {
										rules: [{ required: true, message: 'Author is required' }],
										initialValue: undefined,
                                    })(
										<SuperSelect
											showSearch
											placeholder="Select author"
											style={{ width: 190 }}
											onSelect={(value) => this.handleSelectChange(value, "author")}
											optionFilterProp="children"
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
										>
                                            {this.authorDropdown}
                                        </SuperSelect>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Publisher" style={{ marginBottom: "0px" }}>
									{getFieldDecorator('publisherID', {
										rules: [{ required: true, message: 'Publisher is required' }],
										initialValue: undefined,
                                    })(
										<SuperSelect
											showSearch
											placeholder="Select publisher"
											style={{ width: 190 }}
											onSelect={(value) => this.handleSelectChange(value, "publisher")}
											optionFilterProp="children"
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
										>
											{this.publisherDropdown}
                                        </SuperSelect>
                                    )}
                                </Form.Item>
                            </Col>
						</Row>

						<Form.Item label="Year Published" style={{ marginBottom: "0px" }}>
							{getFieldDecorator('year_published', {
								initialValue: formData.year_published == null ? null : moment(formData.year_published, 'YYYY-MM-DD').add(1, 'days'),
							})(<DatePicker format={dateFormat} />)}
						</Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)

export { AddBookForm };