import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialPeople } from '../initialData';
import { loadFromStorage } from '../utils/storage';

interface PeopleState {
  people: string[];
}

const STORAGE_KEY = 'expenseSplitter_people';

const initialState: PeopleState = {
  people: loadFromStorage(STORAGE_KEY, initialPeople),
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<string>) => {
      state.people.push(action.payload);
    },
    removePerson: (state, action: PayloadAction<string>) => {
      state.people = state.people.filter(person => person !== action.payload);
    },
  },
});

export const { addPerson, removePerson } = peopleSlice.actions;
export default peopleSlice.reducer;
