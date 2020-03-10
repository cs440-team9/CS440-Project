import React, { Component } from 'react';
import { DatePicker, Form, Input, Modal, Row, Col } from 'antd';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

const AddAuthorForm = Form.create({ name: 'add-author-form' })(    // Don't forget to change the names here
    class extends Component {
        constructor(props) {
            super(props);

            var data = {
                name: '',
                dob: null,
				dod: null,
            };

            this.state = { formData: data };
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
                        name: '',
                        dob: null,
                        dod: null,
                    };
                } else if (selectedRowKeys.length === 1 && editing === true) {
                    data = this.props.defaultData.find(item => item.authorID === selectedRowKeys[0]);
                }

                this.setState({
                    formData: data,
                    selectedRowKeys: selectedRowKeys
                });
            }
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
                        <Form.Item label="Name" style={{ marginBottom: "0px" }}>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Name is required' }],
                                initialValue: formData.name || null,
                            })(<Input placeholder="Last, First" />)}
                        </Form.Item>
                        <Row gutter={12}>
                            <Col span={10}>
                                <Form.Item label="Date of Birth" style={{ marginBottom: "0px" }}>
                                    {getFieldDecorator('dob', {
                                        rules: [{ required: true, message: 'Date of birth is required' }],
                                        initialValue: moment(formData.dob) || null,
                                    })(<DatePicker format={dateFormat} />)}
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item label="Date of Death" style={{ marginBottom: "0px" }}>
                                    {getFieldDecorator('dod', {
                                        initialValue: moment(formData.dod) || null,
                                    })(<DatePicker format={dateFormat} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            )
        }
    }
)

export { AddAuthorForm };