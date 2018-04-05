import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { 
	fetchJobList, 
	fetchJobs,
	fetchAddress,
	fetchSearchedJob,
	fetchCommuteOption, 
} from '../queries';
import { JobListItem }from '../components';
import { updateStartingIndex, updateJobList } from '../mutations';
import { Grid } from 'react-bootstrap';
import styles from '../styles/JobList.css';

class JobList extends Component {
	constructor(props){
		super(props);
		this.state = {
			showMap: false
		}
	}
	
	renderJobs(){
    console.log(this.props.fetchJobList.jobList.jobs);
		return this.props.fetchJobList.jobList.jobs.map(({title, company, address, commuteTime, commuteDistance, snippet, url})=>{
			const job = {
				title,
				company,
				snippet,
				url,
				address,
				commuteTime,
				commuteDistance
			};
			const map = {
				homeAddress: this.props.fetchAddress.address.homeAddress,
				companyAddress: address,
				travelMode: this.props.fetchCommuteOption.commuteOption.commuteSelected,
			};
			return (
				<JobListItem key={url} map={map} job={job}/>
			);
		});
	}
  async componentWillUnmount(){
    console.log('JobList componentWillUnmount');
    await this.props.updateStartingIndex({
      variables: {
        index: 0
      }
    });
    await this.props.updateJobList({
      variables: {
        jobs: []
      }
    });
  }
	render(){
		return (
			<Grid>
				{this.renderJobs()}
        <span className={styles.indeed}id="indeed_at">
					<a title="Job Search" href="https://www.indeed.com" rel="nofollow">
					jobs by <img alt='Indeed' src="https://www.indeed.com/p/jobsearch.gif"/>
					</a>
				</span>
        {this.props.children}
			</Grid>
		);
	}

}

export default compose(
	graphql(fetchJobList,{
		name: 'fetchJobList'
	}),
	graphql(fetchAddress,{
		name: 'fetchAddress'
	}),
	graphql(fetchCommuteOption,{
		name: 'fetchCommuteOption'
	}),
  graphql(updateJobList,{
    name: 'updateJobList'
  }),
  graphql(updateStartingIndex,{
    name: 'updateStartingIndex'
  })
)(JobList);