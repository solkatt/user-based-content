import React, { Component } from 'react'
import trashIcon from '../../assets/iconfinder_trash.png'
import { UserConsumer } from '../../contexts/UserContext'
import { Redirect } from 'react-router-dom'
import SignIn from '../SignIn/SignIn'

class EditPostspage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: '',
			text: '',
			file: '',
			fileName: '',
			fileURL: '',
			redirect: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.formRef = React.createRef()
	}

	render() {
		return (
			// Get current user online
			<UserConsumer>
				{(userState) => (
					<>
						<SignIn />
						<div className='editPostContainer'>
							<h3></h3>
							<h1>Redigera post {this.props.data._id}</h1>
							<h2></h2>
							<form
								onSubmit={this.handleSubmit}
								ref={this.formRef}
							>
								<label htmlFor='title'>
									Titel:
									<input
										type='text'
										name='title'
										id='title'
										defaultValue={this.props.data.title}
										placeholder='Skriv din titel här...'
										onChange={this.handleChange}
									/>
								</label>
								<label htmlFor='text'>
									<textarea
										value={this.state.postText}
										name='text'
										id='text'
										cols='30'
										rows='10'
										defaultValue={this.props.data.text}
										placeholder='Skriv något kul här...'
										onChange={this.handleChange}
									/>
								</label>
								<label htmlFor='fileInput'>
									<input
										type='file'
										name='file'
										id='fileInput'
										// defualtvalue={this.props.data.image}
										accept='.png, .jpg, .jpeg'
										onChange={this.handleChange}
									/>
								</label>
								<div className='previewImage'>
									<p>Uppladdad fil:</p>
									{this.state.fileURL !== '' &&
									this.state.fileURL !== null &&
									this.state.fileURL !== undefined ? (
										<img src={this.state.fileURL} alt='' />
									) : null}
								</div>
								<img
									src={trashIcon}
									width='20px'
									height='20px'
									alt=''
								/>
								<button
									type='submit'
									id='delete_post'
									value='Delete'
									onClick={this.handleSubmit}
								>
									Ta bort inlägg
								</button>
								<button
									type='submit'
									id='new_post'
									value='Post'
									name={userState.userId}
									onClick={this.handleSubmit}
								>
									Uppdatera inlägg
									{this.state.redirect && <Redirect to='/' />}
								</button>
							</form>
						</div>
					</>
				)}
			</UserConsumer>
		)
	}

	/**
	 * Handles input change and sets state
	 * @param {Event} event
	 */
	handleChange(event) {
		switch (event.target.name) {
			case 'file':
				const imageFile = event.currentTarget.files[0]
				const imageSource = URL.createObjectURL(
					event.currentTarget.files[0]
				)
				// Sets state for image preview and file to send with request
				this.setState({ file: imageFile, fileURL: imageSource })
				break
			case 'title':
				this.setState({ title: event.target.value })
				break
			case 'text':
				this.setState({ text: event.target.value })
				break
			default:
				break
		}

		console.log(this.state.title)
		console.log(this.state.text)

	}

	/**
	 * Handles submit and makes request to save new post
	 * @param {Event} event
	 */
	handleSubmit(event) {
		event.preventDefault()
		const user = event.target.name
		if (event.target.value === 'Post') {
			const { file, title, text } = this.state
			const inputs = { file, title, text }
			const found = Object.keys(inputs).filter(
				(key) => inputs[key] === ''
			)
			if (found.length !== 0) {
				found.forEach((emptyInput) => {
					if (emptyInput !== 'file') {
						console.log(`${emptyInput} is empty.`)
						return
					}
				})
			}
			console.log('THIS STATE TITLE:', this.state.title)
			// Get input data
			let formData = new FormData(this.formRef.current)
			formData.delete('file')
			formData.append('user', user)
			console.log('FORMDATA', formData.title)

			// Add file to request if it exists
			if (file) {
				formData.append('file', this.state.file)
			}



			// UPDATE
			fetch(`http://localhost:3001/api/post/update/${this.props.data._id}`, {
				
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: this.state.title,
					text: this.state.text,
					file: this.state.file,
					fileName: '',
					fileURL: '',
					redirect: false,
				}),
			})
				.then((res) => {
					// Set state with fileName and then redirect
					this.setState({
						fileName: this.state.file.name,
						redirect: true,
					})
					return
				})
				.catch((error) => console.log(error))
		} else if (event.target.value === 'Delete') {
			console.log('Delete')
			// Ta bort från databasen...
		} else {
			return false
		}
	}
}



// removePost() {
//     fetch(`http://localhost:3001/api/post/remove/${this.props.data._id}`, {
//       method: "DELETE",
//       signal: this.abortController.signal
//     }).then(res => res.json())
//       .then((json) => this.setState({ isDeleted: true }))
//       .catch(error => console.log(error))
//   }

export default EditPostspage
