// library
import { useState, useEffect, useRef } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

// components
import DropDown from 'src/component/search/DropDown';
import RecommendedList from 'src/component/search/RecommendedList';

// id book
import { IdBook } from 'src/data/idBook';

//for API
import API from 'src/utils/api';
const { GetSearach } = API();

// state
import { useRecoilValue } from 'recoil';
import SearchCategoryState from 'src/state/searchCategory';

//style
import { SearchBarLayout } from 'src/styles/compoStyles/searchBarStyle';

const SearchBar = ({
	keyword,
	setKeyword,
	searchRes,
	setSearchRes,
	setList,
	setOutputNeeded,
	setSerchResNeeded,
	isFetching,
	setIsFetching,
}) => {
	// 드롭다운 모달처리
	const dropDownRef = useRef();

	const modalCloseHandler = ({ target }) => {
		if (catSelector && !dropDownRef.current.contains(target)) {
			setCatSelector('closed');
		}
	};

	useEffect(() => {
		window.addEventListener('click', modalCloseHandler);
		return () => {
			window.removeEventListener('click', modalCloseHandler);
		};
	});

	// 박물관/전시관 셀릭터 오픈
	const [catSelector, setCatSelector] = useState('closed');

	// 실시간 검색결과를 바탕으로 추천어 목록 생성
	const [recList, setRecList] = useState([]);

	// 검색 카테고리 (전역값)
	const searchCategory = useRecoilValue(SearchCategoryState);

	// 추천 검색어 모달 on/off
	const [modal, setModal] = useState('off');

	// 실시간 검색
	const realTimeSearch = async (keyword) => {
		if (keyword !== '') {
			// 추천검색어 생성
			let tempArr = [];
			IdBook.forEach((element) => {
				const Name = element.name;
				if (Name.includes(keyword)) {
					tempArr.push(element);
				}
			});
			setRecList([...tempArr]);
			setModal('on');
		} else {
			setModal('off');
		}
	};

	const onChange = (e) => {
		const keywordValue = e.target.value;
		setKeyword(keywordValue);
		if (keywordValue !== '') {
			realTimeSearch(keywordValue);
		} else {
			setModal('off');
		}
	};

	const onClick = () => {
		showSearchResultsToLists(keyword);
		setIsFetching(true);
		setModal('off');
	};

	const onSubmit = (e) => {
		e.preventDefault();
		showSearchResultsToLists(keyword);
		setIsFetching(true);
		setModal('off');
	};
	// 검색결과 띄우기
	const showSearchResultsToLists = async (keyword) => {
		// 검색한 키워드 띄우기
		setSearchRes(keyword);

		// 검색결과 띄우기
		setSerchResNeeded(true);
		setOutputNeeded(true);
		const data = await GetSearach(searchCategory, keyword);
		await setIsFetching(false);
		setList(() => [...data]);

		// 검색창 비움
		setKeyword('');
	};

	return (
		<SearchBarLayout>
			<div ref={dropDownRef}>
				<DropDown
					setList={setList}
					setSerchResNeeded={setSerchResNeeded}
					catSelector={catSelector}
					setCatSelector={setCatSelector}
				/>
			</div>

			{/* <div ref={testRef}></div> */}

			{catSelector == 'closed' && (
				<AiFillCaretDown
					style={{
						position: 'absolute',
						marginTop: '10px',
						marginLeft: '5px',
						color: 'black',
						fontSize: '30px',
					}}
				/>
			)}

			<form onSubmit={onSubmit}>
				<input
					type='text'
					id='name'
					name='name'
					size='40'
					value={keyword}
					onChange={onChange}
					autoComplete='off'
				/>
				{modal == 'on' && (
					<RecommendedList
						recList={recList}
						showSearchResultsToLists={showSearchResultsToLists}
						setModal={setModal}
					/>
				)}
			</form>
			<button onClick={onClick}>🔍</button>
		</SearchBarLayout>
	);
};

export default SearchBar;