/**
 * Client상의 좌표를 Element상의 좌표로 변환합니다.
 * @param clientX
 * @param clientY
 * @param element
 */
export const getCoordRelativeToElement = (
	clientX: number,
	clientY: number,
	element: Element
) => {
	const { top, left } = element.getBoundingClientRect();
	return { x: clientX - left, y: clientY - top };
};
