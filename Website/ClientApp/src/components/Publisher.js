import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

const AddPublisherForm = Form.create({ name: 'add-publisher-form' })(    // Don't forget to change the names here
    class extends Component {
        constructor(props) {
            super(props);

            var data = {
                name: '',
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
                    };
                } else if (selectedRowKeys.length === 1 && editing === true) {
                    data = this.props.defaultData.find(item => item.publisherID === selectedRowKeys[0]);
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
                    title={okayText + " Publisher"}
                    okText={okayText}
                    onCancel={onCancel}
                    onOk={onCreate}
                    width={450}
                >
                    <Form layout="vertical">
                        <Form.Item label="Publisher Name" style={{ marginBottom: "0px" }}>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Publisher name is required' }],
                                initialValue: formData.name || null,
                            })(<Input placeholder="Enter the name of the publisher..." />)}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)

export { AddPublisherForm };