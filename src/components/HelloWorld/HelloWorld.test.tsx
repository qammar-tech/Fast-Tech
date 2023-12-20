import { render, screen } from '@testing-library/react'
import HelloWorld from './HelloWorld'

describe('HelloWorld | component | unit test', () => {
  it('should render with success', () => {
    render(<HelloWorld>Chatly UI</HelloWorld>)

    expect(screen.getByText('Chatly UI')).toBeInTheDocument()
  })
})
