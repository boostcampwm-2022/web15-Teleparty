import { useState } from "react";

import { NicknameInputLayout, WarningText } from "./NicknameInput.styles";

import {
  isIncludesSpecialCharacter,
  isIncludesDigit,
  isIncludesLetter,
} from "../../utils/string";
import { TextInput } from "../common/TextInput";

// 알파벳, 숫자, 특수문자 이외의 문자를 2칸으로 계산한 문자열 길이 반환
const getNicknameLength = (str: string) => {
  return str.split("").reduce((length, char) => {
    const charSize =
      isIncludesSpecialCharacter(char) ||
      isIncludesDigit(char) ||
      isIncludesLetter(char)
        ? 1
        : 2;
    return length + charSize;
  }, 0);
};

const NicknameInput = () => {
  const [input, setInput] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setInput(value);

    const warningMessageList = [];

    if (isIncludesSpecialCharacter(e.target.value)) {
      warningMessageList.push("특수문자를 포함할 수 없습니다!");
    }

    if (getNicknameLength(value) > 16) {
      warningMessageList.push(
        "16칸 이상의 닉네임은 사용할 수 없습니다! (알파벳, 숫자, 특수문자를 제외한 문자는 2칸으로 계산됩니다.)"
      );
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
