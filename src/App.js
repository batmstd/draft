import './App.css';
import {InsertDraft} from "./components/InsertDraft";
import React from "react";
import {OrderedList} from "./components/OrderedList";
import {UserInfo} from "./components/UserInfo";
import {InsertTeams} from "./components/InsertTeams";

function App() {
    const [list, setList] = React.useState([]);
    const [teams, setTeams] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [resultList, setResultList] = React.useState([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const orderDraftCallback = (data) => {
        setList(data);
        setUsers([...new Set(data)].map(user => ({name: user, teams: []})))
    }
    const enterTeamsCallback = (name, teams) => {
        setUsers(prev => prev.map(user => user.name === name ? {
            ...user, teams
        } : user))
    }

    React.useEffect(() => {
        let res = [], selected = [], lastIndex = list.length;
        const teamsToUpperCase = teams.map(t => t.toUpperCase());
        for (let i = 0; i < list.length; i++){
            let user = list[i];
            const team = users.find(u => u.name === user).teams.filter(t => selected.indexOf(t.toUpperCase()) < 0)[0];
            if (!team || teamsToUpperCase.indexOf(team.toUpperCase()) < 0) {
                lastIndex = i - 1;
                break;
            }
            if (selected.indexOf(team.toUpperCase()) < 0 && teamsToUpperCase.indexOf(team.toUpperCase()) >= 0) {
                res.push({user, team})
                selected.push(team.toUpperCase())
            }
        }
        setSelectedIndex(lastIndex)
        const r = teams.map(team => {
            const ut = res.find(r => r.team.toUpperCase() === team.toUpperCase());
            return ut ? {team, user: ut.user} : {team, user: null}
        })

        setResultList(r);
    }, [list, users, teams]);

    return (
        <div className="App">
            {list.length === 0 && <InsertDraft callback={orderDraftCallback}/>}
            {list.length > 0 && teams.length === 0 && <InsertTeams callback={setTeams} />}
            {list.length > 0 && teams.length > 0 && (
                <div className={'main'}>
                    <OrderedList list={list} selectedIndex={selectedIndex}/>
                    <div className={"insert-draft"}>
                        <label>Приоритет команд:</label>
                        <div className={"users"}>
                            {users.map((user, i) => (
                                <UserInfo key={i} name={user.name} callback={enterTeamsCallback}/>
                            ))}
                        </div>
                    </div>
                    <div className={"insert-draft"}>
                        <label>Выбранные команды:</label>
                        <div>
                            {resultList.map((result, i) => (
                                <div key={i}>{i+1}. <b>{result.team}</b> - {result.user}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
