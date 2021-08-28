import { ResourcePicker } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris'

class SelectProducts extends React.Component {
    state = { open: false }
    render() {
        return (
            <Button primary fullWidth
                size="large"
                onClick={() => this.setState({ open: true })}
            >Select Products To Bundle
                <ResourcePicker
                    resourceType='Product'
                    open={this.state.open}
                    onCancel={() => this.setState({ open: false })}
                    onSelection={(resources) => {
                        this.state.open = false
                        this.props.onClick(resources)
                    
                    }}
                />
            </Button>
        )
    }
}

export default SelectProducts 