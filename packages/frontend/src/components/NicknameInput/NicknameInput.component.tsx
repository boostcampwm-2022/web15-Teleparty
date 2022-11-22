import { useState } from "react";

import { NicknameInputLayout, WarningText } from "./NicknameInput.styles";

import { isIncludesSpecialCharacter } from "../../utils/string";
import { TextInput } from "../common/TextInput";

const NicknameInput = () => {
  const [input, setInput] = useState("ge");
  const [warningMessage, setWarningMessage] = useState("");

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setInput(value);

    const warningMessageList = [];

    if (isIncludesSpecialCharacter(e.target.value)) {
      warningMessageList.push("특수문자를 포함할 수 없습니다!");
    }

    setWarningMessage(warningMessageList.join("\n"));
  };

  return (
    <NicknameInputLayout>
      <TextInput
        sizeType="medium"
        placeholder="닉네임을 입력해주세요"
        onChange={onChangeHandler}
        value={input}
      />
      <WarningText>{warningMessage}</WarningText>
    </NicknameInputLayout>
  );
};

export default NicknameInput;
